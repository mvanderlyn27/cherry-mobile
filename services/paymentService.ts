import { observable } from "@legendapp/state";

// Credit package options
export type CreditPackage = {
  id: string;
  name: string;
  credits: number;
  price: number;
  discount?: number; // percentage discount
  featured?: boolean;
};

// Transaction history item
export type Transaction = {
  id: string;
  date: Date;
  credits: number;
  amount: number;
  type: "purchase" | "spent" | "refund" | "bonus";
  description: string;
};

// User credit state
export const userCredits$ = observable({
  balance: 0,
  transactions: [] as Transaction[],
  loading: false,
  error: null as string | null,
});

// Available credit packages
export const creditPackages: CreditPackage[] = [
  {
    id: "basic",
    name: "Basic",
    credits: 50,
    price: 4.99,
  },
  {
    id: "popular",
    name: "Popular",
    credits: 125,
    price: 9.99,
    discount: 15,
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 300,
    price: 19.99,
    discount: 25,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    credits: 700,
    price: 39.99,
    discount: 30,
  },
];

// Fetch user credit balance
export const fetchUserCredits = async (userId: string): Promise<void> => {
  try {
    userCredits$.loading.set(true);
    userCredits$.error.set(null);

    // TODO: Replace with actual API call
    // Simulating API response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data
    userCredits$.balance.set(75);
    userCredits$.transactions.set([
      {
        id: "1",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        credits: 100,
        amount: 9.99,
        type: "purchase",
        description: "Purchased 100 credits",
      },
      {
        id: "2",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        credits: -25,
        amount: 0,
        type: "spent",
        description: 'Unlocked "The Secret Promise"',
      },
    ]);
  } catch (error) {
    userCredits$.error.set("Failed to fetch credit balance");
    console.error("Error fetching credits:", error);
  } finally {
    userCredits$.loading.set(false);
  }
};

// Purchase credits
export const purchaseCredits = async (packageId: string, paymentMethod: string): Promise<boolean> => {
  try {
    userCredits$.loading.set(true);
    userCredits$.error.set(null);

    const selectedPackage = creditPackages.find((pkg) => pkg.id === packageId);
    if (!selectedPackage) {
      throw new Error("Invalid package selected");
    }

    // TODO: Implement actual payment processing
    // Simulating payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update balance after successful purchase
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date(),
      credits: selectedPackage.credits,
      amount: selectedPackage.price,
      type: "purchase",
      description: `Purchased ${selectedPackage.name} package`,
    };

    userCredits$.balance.set((prev) => prev + selectedPackage.credits);
    userCredits$.transactions.set((prev) => [newTransaction, ...prev]);

    return true;
  } catch (error) {
    userCredits$.error.set("Failed to complete purchase");
    console.error("Error purchasing credits:", error);
    return false;
  } finally {
    userCredits$.loading.set(false);
  }
};

// Spend credits (for unlocking content)
export const spendCredits = async (amount: number, itemId: string, itemName: string): Promise<boolean> => {
  try {
    const currentBalance = userCredits$.balance.peek();
    if (currentBalance < amount) {
      userCredits$.error.set("Insufficient credits");
      return false;
    }

    userCredits$.loading.set(true);

    // TODO: Implement actual API call to record the transaction
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date(),
      credits: -amount,
      amount: 0,
      type: "spent",
      description: `Unlocked "${itemName}"`,
    };

    userCredits$.balance.set((prev) => prev - amount);
    userCredits$.transactions.set((prev) => [newTransaction, ...prev]);

    return true;
  } catch (error) {
    userCredits$.error.set("Failed to process transaction");
    console.error("Error spending credits:", error);
    return false;
  } finally {
    userCredits$.loading.set(false);
  }
};

// Get transaction history
export const getTransactionHistory = (): Transaction[] => {
  return userCredits$.transactions.get();
};
