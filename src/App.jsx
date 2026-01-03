
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, BrowserRouter, Routes, Route } from "react-router";

import Homepage from "./pages/home";
import Game from "./pages/game";
import NotFound from "./pages/notFound";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/round/start/:imageId" element={<Game />} />
            <Route path="*" element={<NotFound />} />
          </>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
