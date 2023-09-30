const animeInput = document.getElementById("anime-query");
const results = document.getElementById("results");

animeInput.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
        const animeQuery = document.getElementById("anime-query").value;
        if (!animeQuery) return;
        emptyElement(results);
        return trackAnime(animeQuery);
    }
});

function getTrendings() {
    return new Promise(async function(resolve, reject) {
        try {
            const query = `
                query ($page: Int, $perPage: Int) {
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                        }
                        media (type: ANIME, sort: TRENDING_DESC) {
                            id 
                            title {
                                romaji
                                english
                            }
                            coverImage {
                                extraLarge
                                large
                                medium
                            }
                            siteUrl
                            format
                        }
                    }
                }
            `;
            const variables = {
                page: 1,
                perPage: 6
            };
            
            const request = await fetch("https://graphql.anilist.co", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query, variables })
            });
            const response = await request.json();
            const results = response.data.Page.media;
            for (const result of results) {
                parseResult(result);
            }
        } catch (e) {
            console.error(e);
        }
    });
};
getTrendings();

function parseResult(result) {
    if (!result) return;
    const animeInfo = document.createElement("div");
    const link = document.createElement("a");
    const animeThumb = document.createElement("img");
    const animeTitle = document.createElement("h6");
    
    animeTitle.textContent = result.title.english || result.title.romaji;
    animeTitle.classList.add("anime-title")
    animeThumb.src = result.coverImage.extraLarge || result.coverImage.large || result.coverImage.medium;
    animeThumb.alt = result.title.romaji;
    link.href = window.location.href.split("/")[0] + `/${result.format == "MANGA" ? "manga" : "anime"}/` + result.id;
    link.appendChild(animeThumb);
    link.appendChild(animeTitle);
    animeInfo.appendChild(link);
    animeInfo.classList.add("anime-info");
    results.appendChild(animeInfo);
};

function trackAnime(anime) {
    return new Promise(async function(resolve, reject) {
        try {
            const query = `
                query ($search: String, $page: Int, $perPage: Int) {
                    Page (page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                        }
                        media (search: $search) {
                            id
                            title {
                                romaji
                                english
                            }
                            coverImage {
                                extraLarge
                                large
                                medium
                            }
                            siteUrl
                            format
                        }
                    }
                }
            `;
            const variables = {
                search: anime,
                page: 1,
            };
            
            const request = await fetch("https://graphql.anilist.co", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query, variables })
            });
            const response = await request.json();
            const results = response.data.Page.media;
            for (const result of results) {
                parseResult(result);
            }
        } catch (e) {
            console.error(e);
        }
    });
};

function emptyElement(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}
