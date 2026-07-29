document.addEventListener("DOMContentLoaded", () => {
    const list = document.querySelector("#starred");
    const status = document.querySelector("#status");

    if (!list || !status) {
        console.error("Required page elements are missing.");
        return;
    }

    const setStatus = (message, isError = false) => {
        status.textContent = message;
        status.classList.toggle("error", isError);
    };

    const renderEvents = (events) => {
        if (!Array.isArray(events)) {
            throw new Error("Expected an array of events.");
        }

        list.innerHTML = "";
        list.setAttribute("aria-busy", "false");

        if (events.length === 0) {
            setStatus("No starred repositories were found.");
            return;
        }

        events.forEach((event) => {
            const item = document.createElement("li");
            const name = typeof event?.name === "string" ? event.name : "Unknown repository";
            const starred = typeof event?.starred === "string" ? event.starred : "unknown date";
            item.textContent = `${name} — starred ${starred}`;
            list.appendChild(item);
        });

        setStatus(`Loaded ${events.length} starred repositories.`);
    };

    fetch("events.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load events: ${response.status}`);
            }
            return response.json();
        })
        .then(renderEvents)
        .catch((error) => {
            console.error("Unable to load starred repositories.", error);
            list.innerHTML = "";
            list.setAttribute("aria-busy", "false");
            setStatus("Unable to load starred repositories right now.", true);
        });
});
