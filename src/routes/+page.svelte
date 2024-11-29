<script>
	// @ts-nocheck

	/**
	 * Chunk size: 500 kilobytes.
	 */
	const chunkSize = 500 * 1024;

	let image;

	async function handleCapture(event) {
		image = event.target.files[0];
	}

	function chunkImage(image, chunkSize) {
		return new Promise((resolve, reject) => {
			const chunks = [];

			const reader = new FileReader();

			let offset = 0;

			reader.onload = (event) => {
				const buffer = Array.from(new Uint8Array(event.target.result));

				chunks.push(buffer);

				offset += chunkSize;

				if (offset < image.size) {
					readNextChunk();
				} else {
					console.log('Total chunks:', chunks.length);

					resolve(chunks);
				}
			};

			reader.onerror = (error) => {
				reject(error);
			};

			function readNextChunk() {
				const slice = image.slice(offset, offset + chunkSize);
				reader.readAsArrayBuffer(slice);
			}

			readNextChunk();
		});
	}

	async function uploadImage() {
		if (!image) {
			return;
		}

		const chunks = await chunkImage(
			image,
			chunkSize,
		);

		console.time('Total request time');
		console.time('Chunks upload time');

		const uploadPromises = chunks.map((chunk, index) => {
			return fetch('http://localhost:3000/api/v1/fuel-loads/upload-file', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Basic YWRtaW46YWRtaW4='
					},
					body: JSON.stringify({
						"chunk": chunk,
						"filename": image.name,
						"chunkIndex": index,
					}),
			}).then(response => {
					if (!response.ok) {
						throw new Error(`Error uploading chunk ${index}: ${response.statusText}`);
					}

					console.log(`Chunk ${index} uploaded successfully.`);
			});
		});

		try {
			await Promise.all(uploadPromises);

			console.log('All chunks uploaded successfully.');
		} catch (error) {
			console.error('Error uploading chunks:', error);
		}

		console.timeEnd('Chunks upload time');

		const response = await fetch('http://localhost:3000/api/v1/fuel-loads', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic YWRtaW46YWRtaW4='
			},
			body: JSON.stringify({
				"files": [
					{
							"filename": image.name,
							"totalChunks": chunks.length
					}
				]
			}),
		});

		if (!response.ok) {
			console.error(`Error processing chunks:`, response.statusText);
		}

		console.timeEnd('Total request time');
}
</script>

<main>
	<h1>Take a Photo</h1>
	<input type="file" accept="image/*" capture="camera" on:change={handleCapture} />
	<button on:click={uploadImage}>Upload Photo</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
	}
</style>
