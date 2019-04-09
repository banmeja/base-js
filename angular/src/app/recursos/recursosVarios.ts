declare const $: any;

export class recursosVarios{
    
    constructor(){}

    public showNotification(from: any, align: any, msg:any,color:number) {
        const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
        /* color:number valores,
            0 Blanco
            1 celeste
            2 verde
            3 anaranjado
            4 rojo
            5 rosado
            6 azul
        */
        //const color = Math.floor((Math.random() * 6) + 1);
        let icon='notifications'
        switch(color){
            case 2:{
                icon='check';
                break;
            }
            case 3:{
                icon='warning';
                break;
            }
            case 4:{
                icon='error_outline';
                break;
            }
        }

        $.notify({
            icon: icon,
            message: msg
        }, {
            type: type[color],
            timer: 3000,
            placement: {
                from: from,
                align: align
            },
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          		'<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          		'<i class="material-icons" data-notify="icon">'+icon+'</i> ' +
          		'<span data-notify="title">{1}</span> ' +
          		'<span data-notify="message">{2}</span>' +
          		'<div class="progress" data-notify="progressbar">' +
          			'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          		'</div>' +
          		'<a href="{3}" target="{4}" data-notify="url"></a>' +
          	'</div>'
        });
    }

}