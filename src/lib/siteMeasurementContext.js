import { createContext, useContext } from 'react';
export const SiteMeasurementContext = createContext({ track: () => {}, context: () => null });
export const useSiteMeasurement = () => useContext(SiteMeasurementContext);
