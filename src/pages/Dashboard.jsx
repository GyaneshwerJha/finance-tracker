import { useEffect, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header/Header";
import Cardx from "../components/Cards/Cardx";
import AddExpense from "../components/Modals/AddExpense";
import AddIncome from "../components/Modals/AddIncome";
import moment from "moment";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Transactions from "../components/Transactions/Transactions";

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
  style: {
    background: "black",
    color: "white",
  },
};

const Dashboard = () => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    const toastMessage = localStorage.getItem("toastMessage");
    const toastType = localStorage.getItem("toastType");

    if (toastMessage && toastType) {
      toast[toastType](toastMessage, toastConfig);
      localStorage.removeItem("toastMessage");
      localStorage.removeItem("toastType");
    }
  }, []);

  const [isExpenseModalopen, setisExpenseModalopen] = useState(false);
  const [isIncomeModalopen, setisIncomeModalopen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const showExpenseModal = () => {
    setisExpenseModalopen(true);
  };

  const showIncomeModal = () => {
    setisIncomeModalopen(true);
  };

  const hideExpenseModal = () => {
    setisExpenseModalopen(false);
  };

  const hideIncomeModal = () => {
    setisIncomeModalopen(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"), // Correct date formatting
      amount: parseFloat(values.amount),
      name: values.name,
      tag: values.tag,
    };

    setTransactions((prevTransactions) => {
      const updatedTransactions = [...prevTransactions, newTransaction];
      calculateBalance(updatedTransactions);  // Calculate balance immediately
      return updatedTransactions;
    });

    setisExpenseModalopen(false);
    setisIncomeModalopen(false);
    addTransaction(newTransaction);
  };

  const calculateBalance = (transactionsArray) => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactionsArray.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expenseTotal);
    setCurrentBalance(incomeTotal - expenseTotal);
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  async function addTransaction(transaction) {
    try {
      await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      toast.success("Transaction added successfully", toastConfig);
    } catch (e) {
      toast.error(e.message, toastConfig);
    }
  }

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        const transactionsArray = [];
        querySnapshot.forEach((doc) => {
          transactionsArray.push(doc.data());
        });
        setTransactions(transactionsArray);
        calculateBalance(transactionsArray);  // Calculate balance after fetching transactions
        toast.success("Transactions Fetched!", toastConfig);
      } catch (e) {
        toast.error(e.message, toastConfig);
      }
    }
    setLoading(false);
  }

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ToastContainer />
          <Header />
          <Cardx
            income={income}
            expenses={expenses}
            currentBalance={currentBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            hideExpenseModal={hideExpenseModal}
            hideIncomeModal={hideIncomeModal}
          />
          <AddExpense
            isExpenseModalopen={isExpenseModalopen}
            hideExpenseModal={hideExpenseModal}
            onFinish={onFinish}
          />
          <AddIncome
            isIncomeModalopen={isIncomeModalopen}
            hideIncomeModal={hideIncomeModal}
            onFinish={onFinish}
          />
          <Transactions transactions={transactions} />
        </>
      )}
    </>
  );
};

export default Dashboard;
