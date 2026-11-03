import CashOnly from './pages/CashOnly';
import __Layout from './Layout.jsx';

// Card payments are temporarily unavailable: the site shows a cash-only notice.
// To restore payment methods, swap CashOnly back to ./pages/Home.
export const PAGES = {
    "Home": CashOnly,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
