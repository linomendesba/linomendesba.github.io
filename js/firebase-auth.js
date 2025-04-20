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
  onSnapshot
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

// Variável para controlar o estado de redirecionamento
let isRedirecting = false;

// Função para gerar ou recuperar um ID único para o dispositivo
function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = "device_" + Date.now() + "_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

// Função para registrar este dispositivo como o atual
async function registerCurrentDevice(user) {
  if (!user) return false;
  
  const userRef = doc(db, "users", user.uid);
  const deviceId = getDeviceId();
  
  try {
    // Sempre atualizamos com o dispositivo atual
    await setDoc(
      userRef,
      { 
        deviceId: deviceId, 
        lastLogin: new Date().toISOString(),
        lastLoginTime: Date.now() // Timestamp numérico para comparações
      },
      { merge: true }
    );
    
    return true;
  } catch (error) {
    console.error("Erro ao registrar dispositivo:", error);
    return false;
  }
}

// Configurar listener para monitorar alterações no documento do usuário
function setupDeviceMonitor(user) {
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const deviceId = getDeviceId();
  
  // Retorna a função de cancelamento para poder desativar o listener mais tarde
  return onSnapshot(userRef, (doc) => {
    if (isRedirecting) return; // Evita múltiplos redirecionamentos
    
    if (doc.exists()) {
      const data = doc.data();
      
      // Se o deviceId no documento for diferente do atual, este dispositivo deve fazer logout
      if (data.deviceId && data.deviceId !== deviceId) {
        console.log("Detectada sessão em outro dispositivo. Realizando logout.");
        isRedirecting = true;
        
        // Limpa o ID do dispositivo local e desconecta
        localStorage.removeItem("deviceId");
        signOut(auth).then(() => {
          // Usar setTimeout para evitar problemas com redirecionamentos sobrepostos
          setTimeout(() => {
            window.location.href = "auth.html";
          }, 100);
        });
      }
    }
  });
}

// Monitora o estado de autenticação
let unsubscribeDeviceMonitor = null;

onAuthStateChanged(auth, async (user) => {
  console.log("Estado de autenticação alterado:", user ? "Logado" : "Deslogado");
  
  // Cancelar monitor anterior, se existir
  if (unsubscribeDeviceMonitor) {
    unsubscribeDeviceMonitor();
    unsubscribeDeviceMonitor = null;
  }
  
  if (!user) {
    // Se não houver usuário e não estamos em processo de redirecionamento
    if (!isRedirecting && !window.location.href.includes("auth.html")) {
      window.location.href = "auth.html";
    }
    return;
  }
  
  // Usuário está logado
  console.log("Usuário autenticado:", user.uid);
  
  // Registra este dispositivo
  await registerCurrentDevice(user);
  
  // Configura monitoramento para detectar sessões em outros dispositivos
  unsubscribeDeviceMonitor = setupDeviceMonitor(user);
  
  // Se estamos na página de auth mas o usuário está logado, redireciona para a página principal
  if (window.location.href.includes("auth.html")) {
    window.location.href = "index.html"; // Ajuste para sua página principal
  }
});

// Função de login para a página de autenticação
window.login = async function(email, password) {
  try {
    isRedirecting = false; // Reseta o estado de redirecionamento
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login: " + error.message);
    throw error;
  }
};

// Função de logout
window.logout = function() {
  isRedirecting = true;
  localStorage.removeItem("deviceId");
  
  signOut(auth)
    .then(() => {
      setTimeout(() => {
        window.location.href = "auth.html";
      }, 100);
    })
    .catch((error) => {
      console.error("Erro ao sair:", error);
      setTimeout(() => {
        window.location.href = "auth.html";
      }, 100);
    });
};