import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useStore } from "../Utility/Store";
import { apiBaseUrl, auth0Audience } from "../Config";
import styled from "styled-components";
import { useCaoLang } from "../CaoWasm";

function createProgramDTO(name, program) {
    return {
        name,
        cu: {
            nodes: {
                "-1": {
                    node: {
                        Start: null,
                    },
                    child: 0,
                },
                ...program.nodes.map((n, i) => {
                    const node = n.produceRemote();
                    if (program.nodes[i + 1]) node.child = i + 1;
                    return node;
                }),
            },
        },
    };
}

function createCompilationUnit(caoLang, program) {
    const cu = new caoLang.CompilationUnit();

    cu.nodeSet("-1", new caoLang.AstNode({ Start: null }, 0));
    for (let i in program.nodes) {
        const n = program.nodes[i];
        const node = n.produceRemote();
        let child = null;
        if (program.nodes[i + 1]) child = i + 1;
        try {
            cu.nodeSet(i, new caoLang.AstNode(node.node, child));
        } catch (err) {
            console.error("Failed to create AstNode from ", node, child, err);
            throw err;
        }
    }
    return cu;
}

function Compiler() {
    const [store, dispatch] = useStore();
    const [inProgress, setInProgress] = useState(null);
    const [caoLang, caoLangErr] = useCaoLang();

    const program = store.program;
    const error = store.compilationError;
    useEffect(() => {
        dispatch({ type: "SET_COMPILATION_ERROR", payload: null });
        if (!program.nodes.length) return;
        let cu;
        try {
            cu = createCompilationUnit(caoLang, program);
        } catch (err) {
            console.error(err);
            dispatch({
                type: "SET_COMPILATION_ERROR",
                payload: "Internal Error: Failed to produce compilation unit!",
            });
            return;
        }
        setInProgress(true);
        caoLang
            .compile(cu)
            .then(() => {
                setInProgress(false);
            })
            .catch((err) => {
                setInProgress(false);
                if (!err.response || err.statusCode !== 400) console.error(err);
                dispatch({
                    type: "SET_COMPILATION_ERROR",
                    payload: (err.response && err.response.data) || err,
                });
            });
    }, [dispatch, program, setInProgress, caoLang]);
    if (caoLangErr) {
        return "Failed to load CaoLang";
    }
    return (
        <>
            <div id="compilation-result">
                <CompilationResult error={error} inProgress={inProgress}></CompilationResult>
            </div>
            {!inProgress && <Commmit />}
        </>
    );
}

const CompileError = styled.pre`
    color: #ff6666;
`;

function CompilationResult({ error, inProgress }) {
    if (inProgress) {
        return "Compiling...";
    }
    if (error) {
        return <CompileError>{JSON.stringify(error, null, 4)}</CompileError>;
    }
    return "Compiled successfully";
}

const CommitButton = styled.button`
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border-radius: 3px;
    color: black;
    border: 2px solid ${(props) => props.theme.primary};
`;

function Commmit() {
    const [store, dispatch] = useStore();
    const [inProgress, setInProgress] = useState(null);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    if (!isAuthenticated) return "Log in before you can commit...";
    if (inProgress) return "Processing ...";
    return (
        <CommitButton
            disabled={inProgress}
            onClick={() =>
                commitScript({
                    setInProgress,
                    getAccessTokenSilently,
                    store,
                    dispatch,
                })
            }
        >
            Save
        </CommitButton>
    );
}

async function commitScript({ setInProgress, getAccessTokenSilently, store, dispatch }) {
    const program = store.program;
    if (!program?.nodes?.length) {
        toast.warn("Can not commit empty programs");
        return;
    }
    setInProgress(true);
    try {
        const programDTO = createProgramDTO(store.programName, program);
        const token = await getAccessTokenSilently({
            audience: auth0Audience,
        });
        await Axios.post(`${apiBaseUrl}/scripts/commit`, programDTO, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success("Commit was successful");
    } catch (err) {
        const payload = err.response?.err.response.data ?? err ?? "Unexpected error";
        console.error("Commit error", payload);
        toast.error("Commit failed");
        dispatch({
            type: "SET_COMPILATION_ERROR",
            payload,
        });
    } finally {
        setInProgress(false);
    }
}

export default function Container() {
    return <Compiler></Compiler>;
}
