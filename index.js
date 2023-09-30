import express from "express";
import fetch from "node-fetch";
import path from "path"
import { fileURLToPath } from "url";

const app = express();
const port = 3030;
const __dirname = fileURLToPath(import.meta.url);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("views/index.html", { root: "." });
});
app.get("/track", (req, res) => {
    res.sendFile("views/track.html", { root: "." });
});
app.get("/:format/:id", async (req, res) => {
    const query = `
        query($id: Int) {
          Media(id: $id) {
            id
            title {
              english
              romaji
            }
            coverImage {
              extraLarge
              large
              medium
              color
            }
            bannerImage
            description
            status
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            season
            episodes
            duration
            chapters
            volumes
            format
          }
        }
    `;
    const variables = {
        id: Number(req.params.id)
    };

    const request = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ query, variables })
    });
    const response = await request.json();
    const result = response.data.Media;
    res.render("animeView.ejs", {
        result
    })
});

app.listen(port);
