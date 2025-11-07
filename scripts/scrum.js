import fs from 'node:fs/promises';

async function readCommitMsg() {
  try {
    const file = process.argv[2];

    if (!file) {
      console.error("❌ No commit message file path provided");
      process.exit(1);
    }

    const fileContent = await fs.readFile(file, 'utf-8');
    const pattern = /^SCRUM-\d{1,}:\s.*/;
    const isValid = pattern.test(fileContent.trim());

    if (isValid) {
      process.exit(0);
    } else {
      console.log('❌ Please use SCRUM prefix (e.g. SCRUM-123: Commit message)');
      process.exit(1);
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    process.exit(1);
  }
}

readCommitMsg();
