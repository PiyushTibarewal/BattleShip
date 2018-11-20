import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class Board extends React.Component{
    // constructor(){
    //     super();

    // }
    // componentDidMount  ()  {
    //     $('#submit').click(function(){
    //         var r = document.getElementById("r").value ;
    //         var c = document.getElementById("c").value;
    //         var ta = document.getElementById("t").value;
    //         var colour=document.getElementById("colour").value;
    //         var v=Number((8*r)) + Number(c);
    //         var cell = $("#"+ta).find("td").eq(v); // or $("#Table").find("td").eq(4);
    //         cell.css("background-color",colour);
    //     })
    
    //     $('td').click(function(){
    //   var col = $(this).parent().children().index($(this));
    //   var row = $(this).parent().parent().children().index($(this).parent());
    //   alert('Row: ' + row + ', Column: ' + col);
    // })
    
    // }
    render () {
        return (
            <div>empty
            {/* <table summary="" width="40%" height="40%" class="sidexside" id="user">
            <tr><td></td><td></td><td></td><td ></td><td></td><td></td><td></td><td></td></tr>
     <tr><td ></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
     <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
     <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
     <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
     <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
     <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
     <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                </table>
                <table summary="" width="40%" height="40%" class="sidexside" id="opponent">
                <tr><td></td><td></td><td></td><td ></td><td></td><td></td><td></td><td></td></tr>
        <tr><td ></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
        <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                </table>
         <input type="number" id="r" />Row
        <input type="number" id="c" />column
        <input type="text" id="colour" />colour
        <input type="text" id='t' />table_number
        <button id="submit"> submit</button> */}

            </div>
        );  
    }
        
}
export default Board;
ReactDOM.render(<Board />,document.getElementById("root"));

