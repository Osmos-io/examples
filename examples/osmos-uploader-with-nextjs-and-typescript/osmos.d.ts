declare namespace Osmos {
  // see our docs for explanations of the available options
  type configureOptions = {
    schema: {
      fields: { name: string; displayName: string; description: string }[];
    };
    token: string;
    uploadDescription?: string;
    hideUploadSchema?: boolean;
    hideUploadDescription?: boolean;
    disableAdvancedMode?: boolean;
    maxRecords?: number;
    hideCSVPreviewPane?: boolean;
    completionHandler?: () => Promise<unknown>;
    autoMapEnabled?: boolean;
    autoRecallEnabled?: boolean;
    allowSubmissionWithErrors?: boolean;
    storeTransformsForRecall?: boolean;
  };
  function configure(configureOptions): void;
  function handleClick(uploaderToken?: string): void;
}
