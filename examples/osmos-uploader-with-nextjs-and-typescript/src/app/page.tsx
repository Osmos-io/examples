"use client";
import Script from "next/script";
import styles from "./page.module.css";

export default function Home() {
  const configurationOptions = {
    schema: {
      fields: [
        {
          name: "some_field",
          displayName: "Some Field",
          description: "this is some field",
        },
      ],
    },
    token: process.env.NEXT_PUBLIC_UPLOADER_TOKEN,
  };

  return (
    <main className={styles.main}>
      <Script
        src="https://cdn.osmos.io/button/embed/v1/OsmosButton.js"
        onLoad={() => {
          Osmos.configure(configurationOptions);
        }}
      ></Script>
      <button
        className="ftl-button"
        onClick={() =>
          // while the token is technically optional, the uploader will not work if it is not provided
          window.Osmos.handleClick(configurationOptions.token)
        }
      >
        Upload Your Data
      </button>
    </main>
  );
}
