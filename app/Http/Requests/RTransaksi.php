<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RTransaksi extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_user' => 'required|number',
            'no_telp' => 'required|string',
            'id_jenis' => 'required|number',
            'bukti_pembayaran' => 'required|image|max:5120',
            'check_in' => 'required|date',
            'total_pembayaran' => 'required|number',
            'dibayarkan' => 'required|number',
            'status' => 'required|number',
            
        ];
    }
}