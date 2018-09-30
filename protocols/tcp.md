# TCP
Transmission Control Protocol.

## Content

## Introduction

## TCP Segment

<table class="wikitable" style="margin: 0 auto; text-align:center"><caption>TCP Header</caption><tbody><tr><th style="border-bottom:none; border-right:none;"><i>Offsets</i></th><th style="border-left:none;">Octet></th><th0</th><th1</th><th2</th><th3</th></tr><tr><th style="border-top: none">Octet</th><th>it</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th><th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th></tr><tr><th>0</th><th>0</th><tdSource port</td><tdDestination port</td></tr><tr><th>4</th><th>32</th><tdSequence number</td></tr><tr><th>8</th><th>64</th><tdAcknowledgment number (if ACK set)</td></tr><tr><th>12</th><th>96</th><tdData offset</td><tdReserved<br><b>0 0 0</b></td><td>N<br>S</td><td>C<br>W<br>R</td><td>E<br>C<br>E</td><td>U<br>R<br>G</td><td>A<br>C<br>K</td><td>P<br>S<br>H</td><td>R<br>S<br>T</td><td>S<br>Y<br>N</td><td>F<br>I<br>N</td><tdWindow Size</td></tr><tr><th>16</th><th>128</th><tdChecksum</td><tdUrgent pointer (if URG set)</td></tr><tr><th>20<br>...</th><th>160<br>... </th><td  style="background:#ffd0d0;">Options (if <i>data offset</i> &gt; 5. Padded at the end with "0" bytes if necessary.)<br>...</td></tr></tbody></table>

## TCP handshake

## TCP termination
