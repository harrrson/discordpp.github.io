const withPlugins = require("next-compose-plugins");
const optimizedImages = require("next-optimized-images");
const mdx = require("@next/mdx")({
	options: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
});

/** @type {import("next").NextConfig} */
module.exports = withPlugins(
	[
		[
			mdx,
			{
				reactStrictMode: true,
				basePath: "",
				pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
			},
		],
		[
			optimizedImages,
			{
				/* config for next-optimized-images */
			},
		],
	],
	{
		images: {
			disableStaticImages: true, // Conflicts with next-optimized-images otherwise
		},
		webpack: (config, { isServer }) => {
			config.module.rules.push({
				test: require.resolve("./vals/menuItems.js"),
				use: [{ loader: "val-loader" }],
			});
			if (!isServer) {
				config.resolve.fallback.fs = false;
			}
			return config;
		},
	}
);
