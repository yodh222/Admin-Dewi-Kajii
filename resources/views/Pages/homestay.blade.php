@extends('template.sidebar')
@section('title','Homestay')
@section('content')
<h1 class="fw-bold mt-5">Homestay</h1>
<button type="button" class="btn btn-success mt-2">Tambah Homestay</button>
<div class="container">
    <div class="row mt-5">
        <div class="col-sm-3">
            <div class="card mb-3 bg-light">
                <div class="text-black">
                    <div class="col-md-12">
                        <img src="{{asset('assets\image\kadal.jpg')}}" class="card-img" alt="Homestay"
                            style="width: 100%; height: 150px; object-fit: cover;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">Nama Homestay</h5>
                            <p class="card-text">Harga Homestay</p>
                            <i class="fas fa-edit btn btn-primary btn-sm"></i>
                            <i class="fas fa-trash-alt btn btn-danger btn-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection