import { FileText, Sparkles, Search, MessageSquare } from "lucide-react";

const suggestions = [
  {
    icon: FileText,
    title: "Summarize this document",
    description: "Get a concise overview of the uploaded PDF",
  },
  {
    icon: Search,
    title: "What are the key requirements?",
    description: "Extract important details and action items",
  },
  {
    icon: MessageSquare,
    title: "What technologies are mentioned?",
    description: "Find frameworks, tools, and technical stacks",
  },
  {
    icon: Sparkles,
    title: "Give me a quick overview",
    description: "Understand the document in seconds",
  },
];

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        <div className="text-center">
          <div
            className="
              mx-auto
              mb-8
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              border
              bg-linear-to-b
              from-zinc-900
              to-zinc-950
              shadow-lg
            "
          >
            <Sparkles className="size-10" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight">Doqly</h1>

          <p className="mt-3 text-lg text-muted-foreground">
            AI-powered document intelligence
          </p>

          <h2 className="mt-10 text-3xl font-semibold">Chat with your PDFs</h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Upload a document and get source-backed answers using semantic
            search, vector retrieval, and AI-powered reasoning.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {suggestions.map(({ icon: Icon, title, description }, index) => (
            <button
              key={index}
              className="
                  group
                  rounded-2xl
                  border
                  bg-card
                  p-5
                  text-left
                  transition-all
                  hover:border-primary/50
                  hover:bg-accent
                  hover:shadow-md
                "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      bg-muted
                    "
                >
                  <Icon className="size-5" />
                </div>

                <div>
                  <h3 className="font-medium">{title}</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          Upload a PDF from the sidebar to start chatting with your documents.
        </div>
      </div>
    </div>
  );
}
