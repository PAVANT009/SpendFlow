"use client";

import { useEffect, useState } from "react";

export default function AgentSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    async function getSlug() {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
      console.log(resolvedParams.slug);
    }
    getSlug();
  }, [params]);

  return (
    <div className="px-7 py-7 w-full bg-background h-[1300px]">
      <p className="text-3xl ml-1 mb-1 font-semibold text-foreground">
        Agent Chat
      </p>
      <p className="text-muted-foreground px-2">
        Slug: {slug || "Loading..."}
      </p>
      <p className="text-muted-foreground px-2 text-sm">
        Check the console for the slug value.
      </p>
    </div>
  );
}

