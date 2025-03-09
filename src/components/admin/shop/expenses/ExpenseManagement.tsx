
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ExpenseList } from "./ExpenseList";
import { ExpenseStats } from "./ExpenseStats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { useIsMobile } from "@/hooks/use-mobile";

export const ExpenseManagement = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className={`space-y-6 ${isMobile ? 'p-3' : 'p-6'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Company Expenses</h2>
        <Button 
          onClick={() => setShowExpenseForm(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <ExpenseStats />
      
      <Card className={`${isMobile ? 'p-3 shadow-none border-0 rounded-none -mx-3' : 'p-6 shadow-sm border-gray-100'}`}>
        <ExpenseList />
      </Card>

      <ExpenseForm 
        open={showExpenseForm} 
        onOpenChange={setShowExpenseForm}
      />
    </div>
  );
};
