<script>
	// @ts-nocheck

	/**
	 * Chunk size: 200 kilobytes.
	 */
	const chunkSize = 200 * 1024;

	let image;
	let imageName;

	let uploadStatus = 'Pending';

	let chunksUploadTime;
	let totalUploadTime;

	async function handleCapture(event) {
		image = await compressImage(event.target.files[0], 0.7);
		imageName = event.target.files[0].name;

		uploadStatus = 'Pending';
		chunksUploadTime = null;
		totalUploadTime = null;
	}

	function compressImage(file, maxSizeMB) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;

          const scaleImage = Math.sqrt((maxSizeMB * 1024 * 1024) / file.size);

          if (scaleImage < 1) {
            width *= scaleImage;
            height *= scaleImage;
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          try {
            const blob = await canvasToBlob(canvas, file.type, 0.5);

            resolve(blob);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file);
    });
  }

	function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality);
    });
  }

	function chunkImage(image, chunkSize) {
		return new Promise((resolve, reject) => {
			const chunks = [];
			let offset = 0;

			const reader = new FileReader();

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

		uploadStatus = 'In progress';

		const chunks = await chunkImage(
			image,
			chunkSize,
		);

		const startTime = Date.now();

		const uploadPromises = chunks.map((chunk, index) => {
			return fetch('http://localhost:3000/api/v1/fuel-loads/upload-file/chunk', {
					method: 'POST',
					priority: 'high',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Basic YWRtaW46YWRtaW4='
					},
					body: JSON.stringify({
						"chunk": chunk,
						"filename": imageName,
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
			void Promise.all(uploadPromises);

			console.log('All chunks uploaded successfully.');
		} catch (error) {
			console.error('Error uploading chunks:', error);
		}

		chunksUploadTime = Date.now() - startTime;

		void fetch('http://localhost:3000/api/v1/fuel-loads/upload-file', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic YWRtaW46YWRtaW4='
			},
			body: JSON.stringify({
				"files": [
					{
							"filename": imageName,
							"totalChunks": chunks.length
					}
				]
			}),
		}).then(response => {
				if (!response.ok) {
					console.error(`Error processing chunks:`, response.statusText);
				}
			});

		totalUploadTime = Date.now() - startTime;

		uploadStatus = 'Finished';
}
</script>

<main>
	<h1>Take a Photo</h1>
	<div id="data">
		<input type="file" accept="image/*" capture="camera" on:change={handleCapture} />
		<br>
		<button on:click={uploadImage}>Upload</button>
	</div>
	<div id="info">
			<h3>Upload status: {uploadStatus}.</h3>
			<h3>{chunksUploadTime ? `Chunks upload time: ${(chunksUploadTime / 1000).toFixed(2)} seg.` : ''}</h3>
			<h3>{totalUploadTime ? `Total upload time: ${(totalUploadTime / 1000).toFixed(2)} seg.` : ''}</h3>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
	}
	button {
		margin-top: 20px;
	}
	h3 {
		margin-top: 10px;
	}
	#info {
		margin-top: 30px;
	}
</style>
