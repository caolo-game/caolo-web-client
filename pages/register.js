import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

export default function RegisterPage({ apiUrl }) {
  const token = useSelector((state) => state?.user?.token);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [err, setErr] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(
    (values) => {
      setSubmitting(true);
      (async () => {
        try {
          const response = await fetch(`${apiUrl}/register`, {
            method: "POST",
            body: JSON.stringify(values),
          });

          const responseBody = await response.json();

          console.debug(responseBody);
          switch (response.status) {
            case 200:
              dispatch({
                type: "USER.SET_TOKEN",
                token: responseBody.access_token,
              });
              break;
            case 400:
              setErr(responseBody.detail);
              break;
            case 422:
              setErr(
                responseBody.detail
                  .map((x) => `${x.loc[1]}: ${x.msg}`)
                  .join(",")
              );
              break;
            default:
              console.error("Unhandled status code", response);
              setErr("Unhandled error while submitting");
          }
        } catch (err) {
          console.warn("Failed to register", err);
        }
        setSubmitting(false);
      })();
    },
    [setSubmitting, dispatch]
  );

  console.log(errors);

  return token ? (
    "hello user"
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      {err ? err : null}
      <div>
        <label>Email</label>
        <input type="email" {...register("email", { required: true })}></input>
        {errors.email && errors.email.type}
      </div>
      <div>
        <label>Username</label>
        <input
          type="text"
          {...register("username", { required: true })}
        ></input>
        {errors.username && errors.username.type}
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register("pw", { required: true })}></input>
        {errors.pw && errors.pw.type}
      </div>
      <div>
        <input type="submit" />
      </div>
    </form>
  );
}

export async function getStaticProps(context) {
  const { NEXT_CAO_API_URL: apiUrl } = process.env;

  return {
    props: {
      apiUrl,
    },
  };
}
