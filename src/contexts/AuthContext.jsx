import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../../configs/firebaseConfig';
import { firebaseService } from '../../configs/firebaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // Create user document in Firestore
      await firebaseService.createOrUpdateUser({
        id: result.user.uid,
        email: result.user.email,
        displayName: displayName || result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        emailVerified: result.user.emailVerified
      });

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Create or update user document in Firestore
      await firebaseService.createOrUpdateUser({
        id: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        emailVerified: result.user.emailVerified
      });

      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google signin error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, updates);
        
        // Update user document in Firestore
        await firebaseService.createOrUpdateUser({
          id: currentUser.uid,
          email: currentUser.email,
          displayName: updates.displayName || currentUser.displayName || '',
          photoURL: updates.photoURL || currentUser.photoURL || '',
          emailVerified: currentUser.emailVerified
        });
        
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        
        // If user is logged in, sync with Firestore
        if (user) {
          await firebaseService.createOrUpdateUser({
            id: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified
          });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    signin,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
