import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
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

// Função para gerenciar o dispositivo registrado (versão modificada)
async function manageDeviceAuthentication(user) {
  const userRef = doc(db, "users", user.uid);
  const deviceId = getDeviceId();
  
  try {
    const userDoc = await getDoc(userRef);
    
    // Sempre atualizamos com o dispositivo atual, forçando logout em outros dispositivos
    await setDoc(
      userRef,
      { 
        deviceId: deviceId, 
        lastLogin: new Date().toISOString(),
        forceLogoutTimestamp: new Date().toISOString() // Marca temporal para forçar logout em outros dispositivos
      },
      { merge: true }
    );
    
    return true;
  } catch (error) {
    console.error("Erro ao gerenciar autenticação do dispositivo:", error);
    alert("Erro ao verificar dispositivo: " + error.message);
    localStorage.removeItem("deviceId");
    await signOut(auth);
    window.location.href = "auth.html";
    return false;
  }
}

// Função para verificar se este dispositivo deve ser desconectado
async function checkForForcedLogout(user) {
  if (!user) return;
  
  const deviceId = getDeviceId();
  const userRef = doc(db, "users", user.uid);
  
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const registeredDevice = userData.deviceId;
      
      // Se o dispositivo registrado não é este dispositivo, desloga
      if (registeredDevice && registeredDevice !== deviceId) {
        console.log("Esta conta está sendo usada em outro dispositivo. Fazendo logout...");
        localStorage.removeItem("deviceId");
        await signOut(auth);
        window.location.href = "auth.html";
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Erro ao verificar logout forçado:", error);
    return true; // Em caso de erro, permitimos continuar para não bloquear o usuário
  }
}

// Monitora o estado de autenticação
onAuthStateChanged(auth, async (user) => {
  console.log("Usuário detectado:", user); // Log para depuração
  
  if (!user) {
    window.location.href = "auth.html";
  } else {
    // Verifica se há um logout forçado para este dispositivo
    const canContinue = await checkForForcedLogout(user);
    if (!canContinue) return;
    
    // Registra este dispositivo como o atual
    const isAuthenticated = await manageDeviceAuthentication(user);
    if (!isAuthenticated) return;
    
    console.log("Usuário autenticado:", user.uid);
  }
});

// Função de login (adicione esta função no seu arquivo de autenticação)
window.login = async function(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // O onAuthStateChanged acima vai lidar com o resto
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login: " + error.message);
    throw error;
  }
};

// Função de logout
window.logout = function() {
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