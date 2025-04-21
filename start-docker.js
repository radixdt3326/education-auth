const { exec } = require("child_process");
const path = require("path");

const folders = ["Db", "BE", "FE"];

folders.forEach((folder) => {
    const folderPath = path.join(__dirname, folder);
    console.log(`Starting Docker Compose in: ${folderPath}`);

    // Run docker compose in each directory
    // Execute docker compose command to start containers
    // -f docker-compose.yml: Specify the compose file to use
    // --build: Build images before starting containers
    // -d: Run containers in detached mode (background)
    exec(`docker compose -f docker-compose.yml up --build -d`, { cwd: folderPath }, (error, stdout, stderr) => {
        // Handle execution errors
        if (error) {
            console.error(`Error in ${folder}:`, error.message);
            return;
        }
        // Log any stderr output as warnings
        if (stderr) {
            console.error(`⚠️ Warning in ${folder}:`, stderr);
        }
        // Log successful startup
        console.log(`Docker Compose started in ${folder}:\n${stdout}`);
    });
});

