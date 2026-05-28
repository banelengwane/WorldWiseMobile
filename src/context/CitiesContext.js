import React, {createContext, useContext, useReducer, useEffect } from 'react'

const CitiesContext = useContext()
const BASE_URL = 'http://localhost:8000'

const initialState = { cities = [], isLoading: false, currentCity: {}, error: "" };

function reducer(state, action) {
    switch(action.type) {
        case 'loading': return { ...state, isLoading: true};
        case 'cities/loaded': return { ...state, isLoading: false, cities: action.payload };
        case 'city/loaded': return { ...state, isLoading: false, currentCity: action.payload };
        case 'city/created': return { ...state, isLoading: false, cities: [...state.cities, action.payload], currentCity: action.payload };
        case 'city/deleted': return { ...state, isLoading: false, cities: state.cities.filter(c => c.id !== action.payload), currentCity: {} };
        case 'rejected': return { ...state, isLoading: false, error: action.payload };
        default: throw new Error("Unknown action type");
    }
}

export function CitiesProvider({ children }){
    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        async function fetchCities() {
            dispatch({type: 'loading'});
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({ type: 'cities/loaded', payload: data });
            } catch {
                dispatch({ type: 'rejected', payload: "There was an error loading data..." });
            }
        }
        fetchCities();
    }, []);

    async function getCity(id) {
        if(Number(id) === currentCity.id) return;
        dispatch({ type: 'loading' });
        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({ type: 'city/loaded', payload: data });
        } catch {
            dispatch({ type: 'rejected', payload: "There was an error loading the city..." });
        }
    }

    async function createCity(newCity) {
        dispatch({ type: 'loading' });
        try {
            const res = await fetch(`${BASE_URL}/cities`,{
                method: 'POST', 
                body: JSON.stringify(newCity),
                header: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            dispatch({ type: 'city/created', payload: data });
        } catch {
            dispatch({ type: 'rejected', payload: "There was an error creating the city..." });
        }
    }

    async function deleteCity(id) {
        dispatch({ type: 'loading' });
        try {
            await fetch(`${BASE_URL}/cities/${id}`, { method: 'DELETE' });
            dispatch({ type: 'city/deleted', payload: id });
        } catch {
            dispatch({ type: 'rejected', payload: "There was an error deleting the city..." });
        }
    }

    return (
        <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity, createCity, deleteCity }}>
            {children}
        </CitiesContext.Provider>
    );
}

export function useCities() {
    return useContext(CitiesContext);
}