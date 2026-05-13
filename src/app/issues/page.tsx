import { Suspense } from "react";

import IssuesClient from "./_components/IssuesClient";

const IssuesPage = () => {
  return (
    <Suspense>
      <IssuesClient />
    </Suspense>
  );
};

export default IssuesPage;
