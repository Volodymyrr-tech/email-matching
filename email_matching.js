const fs = require('fs');

function loadJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJson(data, filePath) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

function normalizeString(str) {
    return str.replace(/\W+/g, '').toLowerCase();
}

function isRelatedEmail(userEmail, candidateEmail) {
    const userLocalPart = normalizeString(userEmail.split('@')[0]);
    const candidateLocalPart = normalizeString(candidateEmail.split('@')[0]);
    return userLocalPart.includes(candidateLocalPart) || candidateLocalPart.includes(userLocalPart);
}

function findRelatedEmails(users, sampleData) {
    const recognized = [];
    const notRecognized = [];

    users.forEach(user => {
        const relatedEmails = [];
        const userEmail = user.email;

        sampleData.forEach(data => {
            const candidateEmail = data.account_email || data.email;
            if (candidateEmail && isRelatedEmail(userEmail, candidateEmail)) {
                relatedEmails.push(candidateEmail);
            }
        });

        if (relatedEmails.length > 0) {
            recognized.push({ user_email: userEmail, related_emails: relatedEmails });
        } else {
            notRecognized.push(userEmail);
        }
    });

    return { recognized, not_recognized: notRecognized };
}

function main() {
    const users = loadJson('users.json');
    const sampleData = loadJson('sample_data.json');

    const result = findRelatedEmails(users, sampleData);
    saveJson(result, 'output.json');
}

main();
