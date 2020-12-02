export default async function getUserEmotion() {
    const request = await fetch('http://localhost:5000/');
    const response = await request.json();

    const valence = response.valence / 10;
    const arousal = response.arousal / 10;

    return { valence, arousal };
}