export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<style>{`
					h1 {
						color: #fff;
					}
					`}</style>
			</head>
			<body>{children}</body>
		</html>
	);
}
