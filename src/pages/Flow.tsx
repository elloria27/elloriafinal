import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FlowCanvas } from "@/components/flow/FlowCanvas";

export default function Flow() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center">Product Flow</h1>
        <FlowCanvas />
      </main>
      <Footer />
    </div>
  );
}