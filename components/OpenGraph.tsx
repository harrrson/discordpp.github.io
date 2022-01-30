import Head from "next/head";
import { useRouter } from "next/router";

interface OpenGraphProps {
	title?: string;
	description?: string;
}

export default function OpenGraph({
	title = "Discord++ Docs",
	description = "The Original C++ Discord Library",
}: OpenGraphProps) {
	const router = useRouter();
	const url = `https://discordpp.theundarkpixel.com/${router.asPath}`;

	return (
		<Head>
			<title>{title}</title>
			<meta key="description" name="description" content={description} />

			{/* Twitter */}
			<meta name="twitter:card" content="summary" key="twitter-card" />
			<meta name="twitter:creator" content="@discord" key="twitter-handle" />

			{/* Open Graph */}
			<meta property="og:url" content={url} key="og-url" />
			<meta property="og:image" content="/opengraph.png" key="og-image" />
			<meta property="og:site_name" content="Discord Developers" key="og-site-name" />
			<meta property="og:title" content={title} key="og-title" />
			<meta property="og:description" content={description} key="og-desc" />
		</Head>
	);
}
