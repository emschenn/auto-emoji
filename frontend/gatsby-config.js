require("dotenv").config({
  path: ".env",
});

module.exports = {
  siteMetadata: {
    title: "Emoji Recommender",
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true, // defaults to false
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `auto-emoji`,
        short_name: `auto-emoji`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
};
