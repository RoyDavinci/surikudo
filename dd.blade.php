@extends('admin.layout')
@section('title')
    Buypower Airtime & Data Export
@endsection

@section('content')
    <section class="content-header">
        <h1>Buypower Export <small>Max 7-day range per request</small></h1>
        <ol class="breadcrumb">
            <li><a href="{{ url('home') }}"><i class="fa fa-dashboard"></i> Home</a></li>
            <li class="active">Buypower Export</li>
        </ol>
    </section>

    <section class="content">

        @if (session('status'))
            <div class="alert alert-success">{{ session('status') }}</div>
        @endif
        @if (session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul style="margin-bottom:0;">
                    @foreach ($errors->all() as $e)
                        <li>{{ $e }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="row">
            <div class="col-md-6 col-md-offset-3">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title"><i class="fa fa-download"></i> Export Buypower Transactions</h3>
                    </div>
                    <div class="box-body">
                        {{-- Ensure this URL matches your Route in web.php --}}
                        <form method="POST" action="{{ url('buypower/export') }}">
                            @csrf

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Start Date & Time <span class="text-danger">*</span></label>
                                        <input type="datetime-local" name="start_date" class="form-control"
                                            value="{{ old('start_date') }}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>End Date & Time <span class="text-danger">*</span></label>
                                        <input type="datetime-local" name="end_date" class="form-control"
                                            value="{{ old('end_date') }}" required id="endDateInput">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Type <span class="text-danger">*</span></label>
                                        <select name="type" class="form-control" required>
                                            <option value="airtime" {{ old('type') == 'airtime' ? 'selected' : '' }}>Airtime
                                            </option>
                                            <option value="data" {{ old('type') == 'data' ? 'selected' : '' }}>Data
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Status</label>
                                        <select name="status" class="form-control">
                                            <option value="all" {{ old('status') == 'all' ? 'selected' : '' }}>All
                                            </option>
                                            <option value="successful"
                                                {{ old('status') == 'successful' ? 'selected' : '' }}>Successful</option>
                                            <option value="failed" {{ old('status') == 'failed' ? 'selected' : '' }}>Failed
                                            </option>
                                            <option value="pending" {{ old('status') == 'pending' ? 'selected' : '' }}>
                                                Pending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="alert alert-info" style="font-size:13px; margin-bottom:15px;">
                                <i class="fa fa-info-circle"></i>
                                <strong>Note:</strong> Range cannot exceed <strong>7 days</strong>.
                            </div>

                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fa fa-download"></i> Export CSV
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@section('scripts')
    <script>
        document.querySelector('input[name="start_date"]').addEventListener('change', function() {
            var start = new Date(this.value);
            if (isNaN(start)) return;

            var maxEnd = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
            var pad = function(n) {
                return String(n).padStart(2, '0');
            };

            // Format: YYYY-MM-DDTHH:MM
            var maxStr = maxEnd.getFullYear() + '-' +
                pad(maxEnd.getMonth() + 1) + '-' +
                pad(maxEnd.getDate()) + 'T' +
                pad(maxEnd.getHours()) + ':' +
                pad(maxEnd.getMinutes());

            document.getElementById('endDateInput').setAttribute('max', maxStr);
        });
    </script>
@endsection
