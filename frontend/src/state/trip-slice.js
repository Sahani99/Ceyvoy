import { getStart } from "@/data/get-start";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locations: [],
  distanceAndDurations: [],
  questionnaire: {
    people: 1,
    arrival: new Date(),
    days: 1,
    budget: getStart.budget[0].value,
    language: getStart.languages[0].value,
    environment: [],
  },
  summery: {
    accommodations: [],
    accommodationPrices: [],
    guide: null,
    guidePrice: 0,
  },
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    addOrRemoveLocation: (state, action) => {
      const index = state.locations.findIndex(
        (location) => location.id === action.payload.id,
      );

      if (index === -1) {
        state.locations.push(action.payload);
      } else {
        state.locations.splice(index, 1);
      }
    },

    clearLocations: (state) => {
      state.locations = [];
    },

    setTrip: (state, action) => {
      state.locations = action.payload;
    },

    setDistanceAndDurations: (state, action) => {
      state.distanceAndDurations = action.payload;
    },

    resetDistanceAndDurations: (state) => {
      state.distanceAndDurations = [];
    },

    setQuestionnaire: (state, action) => {
      const { key, value } = action.payload;
      state.questionnaire[key] = value;
    },

    resetQuestionnaire: (state) => {
      state.questionnaire = {
        people: 1,
        arrival: new Date().getUTCDate(),
        days: 1,
        budget: getStart.budget[0].value,
        language: getStart.languages[0].value,
        environment: [],
      };
    },

    addOrRemoveSummeryGuide: (state, action) => {
      if (state.summery.guide === action.payload.id) {
        state.summery.guide = null;
        state.summery.guidePrice = 0;
      } else {
        state.summery.guide = action.payload.id;
        state.summery.guidePrice = action.payload.price;
      }
    },

    addOrRemoveSummerAccommodations: (state, action) => {
      const index = state.summery.accommodations.findIndex(
        (accommodation) => accommodation === action.payload.id,
      );

      if (index === -1) {
        state.summery.accommodations.push(action.payload.id);
        state.summery.accommodationPrices.push(action.payload.price);
      } else {
        state.summery.accommodations.splice(index, 1);
        state.summery.accommodationPrices.splice(index, 1);
      }
    },

    resetSummery: (state) => {
      state.summery = {
        accommodations: [],
        accommodationPrices: [],
        guide: null,
        guidePrice: 0,
      };
    },
  },
});

export const {
  addOrRemoveLocation,
  clearLocations,
  setTrip,
  setDistanceAndDurations,
  resetDistanceAndDurations,
  setQuestionnaire,
  resetQuestionnaire,
  addOrRemoveSummeryGuide,
  addOrRemoveSummerAccommodations,
  resetSummery,
} = tripSlice.actions;
export default tripSlice.reducer;
