import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";

export default function RegisterPage({ apiUrl }) {
  const token = useSelector((state) => state?.user?.token);
  const dispatch = useDispatch();

  const [err, setErr] = useState(null);

  return token ? (
    "hello user"
  ) : (
    <Formik
      initialValues={{ username: "", pw: "", email: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.username) errors.username = "Required";
        if (!values.email) errors.email = "Required";
        if (values.email.indexOf("@") < 0)
          errors.email = "Please enter a valid email address";
        if (!values.pw) errors.pw = "Required";
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
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
          <input
            type="text"
            name="username"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
          ></input>
          {errors.username && touched.username && errors.username}
          <input
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          ></input>
          {errors.email && touched.email && errors.email}
          <input
            type="password"
            name="pw"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.pw}
          ></input>
          {errors.pw && touched.pw && errors.pw}
          <button type="submit" disabled={isSubmitting}>
            Sign up
          </button>
        </form>
      )}
    </Formik>
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
