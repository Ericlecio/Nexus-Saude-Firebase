import { firestore } from "../firebase"; // Certifique-se de importar o Firestore
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, getDoc, query, where } from "firebase/firestore";

class DAOService {
  constructor(collectionPath) {
    if (!collectionPath) {
      throw new Error("Collection path must be provided");
    }
    this.collectionRef = collection(firestore, collectionPath);
  }

  // Método para inserir um documento
  async insert(object) {
    try {
      const docRef = await addDoc(this.collectionRef, object);
      return docRef.id; // Retorna o ID do documento criado
    } catch (error) {
      console.error("Error adding document: ", error);
      throw new Error("Error adding document");
    }
  }

  // Método para atualizar um documento
  async update(id, object) {
    try {
      const docRef = doc(firestore, this.collectionRef.path, id);
      await updateDoc(docRef, object);
    } catch (error) {
      console.error("Error updating document: ", error);
      throw new Error("Error updating document");
    }
  }

  // Método para excluir um documento
  async delete(id) {
    try {
      const docRef = doc(firestore, this.collectionRef.path, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw new Error("Error deleting document");
    }
  }

  // Método para buscar todos os documentos
  async getAll() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const documents = [];

      querySnapshot.forEach(doc => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw new Error("Error getting documents");
    }
  }

  // Método para buscar um único documento por ID
  async get(id) {
    try {
      const docRef = doc(firestore, this.collectionRef.path, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("No such document!");
      }
    } catch (error) {
      console.error("Error getting document: ", error);
      throw new Error("Error getting document");
    }
  }

  // Método para buscar documentos com base em um filtro
  async search(property, value) {
    try {
      const q = query(this.collectionRef, where(property, "==", value));
      const querySnapshot = await getDocs(q);
      const documents = [];

      querySnapshot.forEach(doc => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error) {
      console.error("Error searching documents: ", error);
      throw new Error("Error searching documents");
    }
  }
}

export default DAOService;
