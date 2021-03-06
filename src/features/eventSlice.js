import { createSlice } from "@reduxjs/toolkit";
import { db, storage } from "../config/firebaseConfig";

export const eventSlice = createSlice({
  name: "events",
  initialState: {
    event: null,
  },
  reducers: {
    //create an event
    createProject: (state, action) => {
      if (action.payload.image !== "") {
        const upload = storage
          .ref(`events/${action.payload.image.name}`)
          .put(action.payload.image);
        upload.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Progress ${progress}`);
            if (snapshot.state === "RUNNING") {
              console.log(`Progress ${progress}`);
            }
          },
          (error) => console.log(error.code),
          async () => {
            function join(t, a, s) {
              function format(m) {
                let f = new Intl.DateTimeFormat("en", m);
                return f.format(t);
              }
              return a.map(format).join(s);
            }

            const date = new Date(action.payload.date);
            const a = [
              { day: "numeric" },
              { month: "short" },
              { year: "numeric" },
            ];
            const formattedDate = join(date, a, " ");
            const downloadURL = await upload.snapshot.ref.getDownloadURL();
            console.log("created project", action.payload);
            db.collection("events").add({
              title: action.payload.title,
              speakerName: action.payload.speakerName,
              speakerDetails: action.payload.speakerDetails,
              eventDescription: action.payload.eventDescription,
              date: formattedDate,
              image: downloadURL,
            });
          }
        );
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { createProject } = eventSlice.actions;

export const selectUser = (state) => state.events.event;

export default eventSlice.reducer;
