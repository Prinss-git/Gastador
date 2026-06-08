import { useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '../services/firebase'

export function useAuth() {
  // auth.currentUser is set synchronously from the persisted session cache
  // so we only show a loading screen when it's genuinely unknown
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [loading, setLoading] = useState(auth.currentUser === null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  const signUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password)

  const signOut = () => firebaseSignOut(auth)

  return { user, loading, signIn, signUp, signOut }
}
