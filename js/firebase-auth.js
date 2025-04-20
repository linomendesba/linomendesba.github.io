import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDmLGMBnUa2YOdP0b-zlZepXjm-zlV477A",
  authDomain: "linoautenticador.firebaseapp.com",
  projectId: "linoautenticador",
  storageBucket: "linoautenticador.firebasestorage.app",
  messagingSenderId: "946057648829",
  appId: "1:946057648829:web:ac5c2b1ba66e651f9d75d4",
  measurementId: "G-4WT805FFHQ",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para gerar ou recuperar um ID único para o dispositivo
function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = "device_" + Date.now() + "_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

// Função para gerenciar o dispositivo registrado
async function restrictToSingleDevice(user) {
  const userRef = doc(db, "users", user.uid);
  const deviceId = getDeviceId();

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const registeredDevice = userDoc.data().deviceId;

      if (registeredDevice && registeredDevice !== deviceId) {
        alert("Esta conta está sendo usada em outro dispositivo. Faça login novamente.");
        localStorage.removeItem("deviceId");
        await signOut(auth);
        window.location.href = "auth.html";
        return false;
      }
    }

    await setDoc(
      userRef,
      { deviceId: deviceId, lastLogin: new Date().toISOString() },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Erro ao restringir dispositivo:", error);
    alert("Erro ao verificar dispositivo: " + error.message);
    localStorage.removeItem("deviceId");
    await signOut(auth);
    window.location.href = "auth.html";
    return false;
  }
}

// Monitora o estado de autenticação
onAuthStateChanged(auth, async (user) => {
  console.log("Usuário detectado:", user); // Log para depuração
  if (!user) {
    window.location.href = "auth.html";
  } else {
    const isValidDevice = await restrictToSingleDevice(user);
    if (!isValidDevice) {
      return;
    }
    console.log("Usuário autenticado:", user.uid);
  }
});

// Função de logout
window.logout = function () {
  // Limpa o deviceId antes de tentar deslogar
  localStorage.removeItem("deviceId");
  signOut(auth)
    .then(() => {
      alert("Você saiu com sucesso!");
      window.location.href = "auth.html";
    })
    .catch((error) => {
      alert("Erro ao sair: " + error.message);
      window.location.href = "auth.html"; // Redireciona mesmo se houver erro
    });
};