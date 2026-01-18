/* Rationale:
Trade data context for managing active trade information across components.
We use React Context for trade data that needs to be shared between trade chat, status updates, and payment confirmation. */

import { createContext, useContext, useEffect, useState } from 'react';

const TradeDataContext = createContext();

export const TradeDataProvider = ({ children }) => {
    // Because active trade data needs to be accessible across multiple components (chat, payment, status), we use context
    const [tradeData, setTradeData] = useState(null);
    useEffect(() => {
        // TODO: Add trade data persistence or cleanup logic here
    }, [tradeData])
    return (
        <TradeDataContext.Provider value={{ tradeData, setTradeData }}>
            {children}
        </TradeDataContext.Provider>
    );
};

export const useTradeData = () => useContext(TradeDataContext);
