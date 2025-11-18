// Workaround script to generate Prisma Client when binaries server is down
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function generatePrismaClient() {
  try {
    console.log('Attempting to generate Prisma Client...');

    // Set environment variables
    process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = '1';
    process.env.PRISMA_SKIP_POSTINSTALL_GENERATE = 'true';

    // Try to generate
    const { stdout, stderr } = await execAsync('npx prisma generate', {
      env: {
        ...process.env,
        PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING: '1',
        PRISMA_SKIP_POSTINSTALL_GENERATE: 'true',
      }
    });

    console.log('Success:', stdout);
    if (stderr) console.error('Warnings:', stderr);

  } catch (error) {
    console.error('Prisma generate failed, but continuing...');
    console.log('The application may work if engines are already cached.');
  }
}

generatePrismaClient();
