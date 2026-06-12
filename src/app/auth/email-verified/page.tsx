export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center">
        <div className="text-6xl mb-5">✅</div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Email vérifié
        </h1>

        <p className="text-gray-600 leading-relaxed mb-8">
          Votre adresse email a été vérifiée avec succès.
          Vous pouvez maintenant utiliser votre compte.
        </p>

        <a
          href="/login"
          className="
            inline-flex
            items-center
            justify-center
            rounded-lg
            bg-blue-600
            px-6
            py-3
            text-white
            font-semibold
            transition
            hover:bg-blue-700
          "
        >
          Se connecter
        </a>
      </div>
    </div>
  );
}