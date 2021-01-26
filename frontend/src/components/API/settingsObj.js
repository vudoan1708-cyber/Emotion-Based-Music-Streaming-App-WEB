export default function settingsObj(userDetail, personalisationBtn, spotifyBtn) {
  return {
    user: {
      id: userDetail.value.id,
      name: userDetail.value.name,
      location: userDetail.value.location,
      email: userDetail.value.email,
    },
    last_checked: {
      muserfly: personalisationBtn.value.checked,
      spotify: spotifyBtn.value.checked,
    },
  };
}
