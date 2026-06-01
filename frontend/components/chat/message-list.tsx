export function MessageList() {
  return (
    <div
      className="
      flex-1
      overflow-y-auto
      p-8
    "
    >
      <div
        className="
        h-full
        flex
        items-center
        justify-center
      "
      >
        <div className="text-center">
          <h2
            className="
            text-4xl
            font-bold
          "
          >
            Ask your documents
          </h2>

          <p
            className="
            mt-2
            text-muted-foreground
          "
          >
            Upload a PDF to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
