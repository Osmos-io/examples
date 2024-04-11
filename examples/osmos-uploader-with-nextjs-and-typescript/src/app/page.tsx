"use client";
import Script from "next/script";
import styles from "./page.module.css";

export default function Home() {
  const configureOptions = {
    schema: {
      fields: [
        {
          name: "some_field",
          displayName: "Some Field",
          description: "this is some field",
        },
      ],
    },
  };

  return (
    <main className={styles.main}>
      <Script src="https://cdn.osmos.io/button/embed/v1/OsmosButton.js"></Script>
      <Script id="osmos-configure">{`Osmos.configure(${configureOptions});`}</Script>
      <button
        className="ftl-button"
        onClick={() =>
          // while the token is technically optional, the uploader will not work if it is not provided
          window.Osmos.handleClick(process.env.NEXT_PUBLIC_UPLOADER_TOKEN)
        }
      >
        Upload Your Data
      </button>
    </main>
  );
}
