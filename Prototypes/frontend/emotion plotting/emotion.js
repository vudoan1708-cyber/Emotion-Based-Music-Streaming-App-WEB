export default async function getUserEmotion() {
  let emotionDetected = false;

  const request = await fetch('http://localhost:5000/userscore');
  const response = await request.json();

  const valence = response.valence / 10;
  const arousal = response.arousal / 10;
  console.log(valence, arousal)
  emotionDetected = true;
  return { valence, arousal, emotionDetected }
}