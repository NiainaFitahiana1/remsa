export default function EmailVerificationErrorPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="text-6xl mb-5">❌</div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Vérification échouée
        </h1>

        <p className="text-gray-600 leading-relaxed mb-8">
          Le lien de vérification est invalide ou a expiré.
          Veuillez demander un nouveau lien de vérification.
        </p>

        <a
          href="/login"
          className="
            inline-flex
            items-center
            justify-center
            rounded-lg
            bg-red-600
            px-6
            py-3
            text-white
            font-semibold
            transition
            hover:bg-red-700
          "
        >
          Retour à la connexion
        </a>
      </div>
    </div>
  );
}