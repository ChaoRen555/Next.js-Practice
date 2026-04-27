import { Suspense } from "react";

import IssuesClient from "./IssuesClient";

const IssuesPage = () => {
  return (
    <Suspense>
      <IssuesClient />
    </Suspense>
  );
};

export default IssuesPage;
