import React from "react";

import FundChecker from "./src/components/fund-checker/FundChecker";

export default function Home() {
  return (
    <div className="min-h-screen  flex justify-center items-center p-4 bg-black">
      <FundChecker />
    </div>
  );
}

