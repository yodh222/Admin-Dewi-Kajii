<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\MAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Session::has('Auth')) {
            return redirect('Login')->with('error', 'Anda belum login');
        }

        $user = $this->decrypt(Session::get('Auth'), 'DewiiKajiiSecret');
        $verif = MAdmin::where('email', $user['email'])->first();

        if ($user['email'] == $verif->email && $user['password'] ==  $verif->password) {
            return $next($request);
        }

        return redirect('Login')->with('sessionError', "Session anda telah habis silahkan login kembali");
    }

    private function decrypt($value, $key)
    {
        $cipher = "AES-256-CBC";
        $options = 0;
        $iv_length = openssl_cipher_iv_length($cipher);

        $decodedValue = base64_decode($value);

        $iv = substr($decodedValue, 0, $iv_length);
        $encrypted = substr($decodedValue, $iv_length);

        $decrypted = openssl_decrypt($encrypted, $cipher, $key, $options, $iv);

        return json_decode($decrypted, true);
    }
}