import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";

export default function LoginPage({ apiUrl }) {
  const token = useSelector((state) => state?.user?.token);
  const dispatch = useDispatch();

  const [err, setErr] = useState(null);

  if (!token)
    return (
      <Formik
        initialValues={{ username: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.username) errors.username = "Required";
          if (!values.password) errors.password = "Required";
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          (async () => {
            try {
              const data = new URLSearchParams();
              data.append("username", values.username);
              data.append("password", values.password);
              const response = await fetch(`${apiUrl}/token`, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                referrerPolicy: "no-referrer",
                body: data,
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
                default:
                  console.error("Unhandled status code", response);
                  setErr("Unhandled error while submitting");
              }
            } catch (err) {
              console.warn("Failed to log in", err);
            }

            setSubmitting(false);
          })();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            {err ? err : null}
            <div>
              <label>Username</label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
              ></input>
              {errors.username && touched.username && errors.username}
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              ></input>
              {errors.password && touched.password && errors.password}
            </div>
            <button type="submit" disabled={isSubmitting}>
              Log in
            </button>
          </form>
        )}
      </Formik>
    );
  else return "Hello user";
}

export async function getStaticProps(context) {
  const { NEXT_CAO_API_URL: apiUrl } = process.env;

  return {
    props: {
      apiUrl,
    },
  };
}
